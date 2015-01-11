<?php namespace Repository;

use Illuminate\Database\Eloquent\SoftDeletingTrait;

class Confide extends \Eloquent {
    
    protected $fillable = array('pull_id', 'content');

    use SoftDeletingTrait;

    public function pull() {
        return $this->belongsTo('Pull');
    }

    public static function post($pull_id, $content) {
        $confide = static::create(compact('pull_id', 'content'));

        return $confide;
    }
}