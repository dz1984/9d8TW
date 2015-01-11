<?php
use Repository\PullRepository;

class PullController extends BaseController {
    private $pullRepository;

    public function __construct(PullRepository $pullRepository)
    {
        parent::__construct();
        $this->pullRepository = $pullRepository;
    }

    public function getIndex()
    {
        $this->view('pull.index');
    }

    public function getAll()
    {
        $status = 'FAIL';
        $message = '';
        $pulls = array();

        if (Request::ajax())
        {

            $bounds = Input::get('bounds');

            // findout all pull records between this bounds.
            $pulls = $this->pullRepository
                          ->findAllByBounds($bounds)
                          ->toArray();

            $status = 'OK';

        }

        return $this->json(compact('status', 'message', 'pulls'));
    }

    public function getAdd()
    {
        $status = 'FAIL';
        $message = '';
        $pull = array();

        if (Request::ajax())
        {
            $pull_id = Input::get('id');
            $lat = Input::get('lat');
            $lng = Input::get('lng');
            $address = Input::get('addr');
            $content = Input::get('content');

            if (null == $pull_id)
            {
                $pull = $this->pullRepository
                             ->addPull(compact('lat', 'lng', 'address'));

                $pull_id = $pull->id;
            }

            $this->pullRepository
                 ->addConfide($pull_id, $content);

            $pull = $this->pullRepository
                         ->findById($pull_id)
                         ->toArray();

            $status = 'OK';
        }

        return $this->json(compact('status', 'message', 'pull'));
    }
}