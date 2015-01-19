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
            $pull = $this->pullRepository
                         ->findOrNew(Input::all())
                         ->toArray();

            $status = 'OK';
        }

        return $this->json(compact('status', 'message', 'pull'));
    }
}